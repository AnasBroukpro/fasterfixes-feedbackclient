import { SubscriptionStatus } from "@/server/auth/config/subscription-plans";
import { stripeApi } from "@/server/stripe";
import { adminProcedure } from "@/server/trpc/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { prisma } from "@workspace/db/index";
import Stripe from "stripe";
import { getMonthlyChurnRate } from "../../_utils/get-churn-rate";

export const getMrr = adminProcedure.query(async () => {
  const subscriptions = await prisma.subscription.findMany({
    where: { status: SubscriptionStatus.Active },
    select: { stripeSubscriptionId: true },
  });

  let totalMrrCents = 0;

  for (const subscription of subscriptions) {
    if (!subscription.stripeSubscriptionId) continue;

    try {
      const stripeSubscription = await stripeApi.subscriptions.retrieve(
        subscription.stripeSubscriptionId,
        { expand: ["items.data.price"] }
      );

      for (const item of stripeSubscription.items.data) {
        const price = item.price as Stripe.Price;

        if (!price.unit_amount) continue;

        // unit_amount is per seat; multiply by quantity or seat-based plans
        // (e.g. 5-seat Agency) are counted as a single seat and MRR collapses.
        const quantity = item.quantity ?? 1;
        const periodAmount = price.unit_amount * quantity;

        // Normalize every billing cadence to a monthly figure. interval_count
        // matters: a "every 3 months" price bills periodAmount per quarter, so
        // its MRR is periodAmount / 3 — not periodAmount.
        const interval = price.recurring?.interval;
        const intervalCount = price.recurring?.interval_count ?? 1;
        let monthlyAmount: number;
        switch (interval) {
          case "year":
            monthlyAmount = periodAmount / (12 * intervalCount);
            break;
          case "week":
            monthlyAmount = (periodAmount * 52) / 12 / intervalCount;
            break;
          case "day":
            monthlyAmount = (periodAmount * 365) / 12 / intervalCount;
            break;
          case "month":
          default:
            monthlyAmount = periodAmount / intervalCount;
            break;
        }

        totalMrrCents += monthlyAmount;
      }
    } catch (error) {
      console.error(
        `Failed to fetch Stripe subscription ${subscription.stripeSubscriptionId}:`,
        error
      );
    }
  }

  // Gross = money charged to customers; net = what lands after Stripe fees and
  // refunds. Both must be gated to revenue-bearing transaction types: a payout
  // to the bank is itself a balance transaction with negative `net`, so summing
  // every type cancelled each charge against its later payout and net collapsed
  // to roughly the un-paid-out (recent) balance. `txn.net` already nets the
  // Stripe fee out of a charge, so summing net over these types yields true net
  // revenue without double-counting fees. `limit: 100` is the page size; the
  // `for await` auto-paginates the full history rather than capping at 100.
  const grossTypes = new Set(["charge", "payment"]);
  const netRevenueTypes = new Set([
    "charge",
    "payment",
    "refund",
    "payment_refund",
    "payment_failure_refund",
    "adjustment", // disputes / chargebacks
  ]);
  let grossRevenueCents = 0;
  let netRevenueCents = 0;
  try {
    for await (const txn of stripeApi.balanceTransactions.list({
      limit: 100,
    })) {
      if (grossTypes.has(txn.type)) {
        grossRevenueCents += txn.amount;
      }
      if (netRevenueTypes.has(txn.type)) {
        netRevenueCents += txn.net;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Stripe balance transactions:", error);
  }

  const activeCount = subscriptions.length;
  const churnRate = await getMonthlyChurnRate();

  const mrr = totalMrrCents / 100;
  const arr = mrr * 12;
  const grossRevenue = grossRevenueCents / 100;
  const netRevenue = netRevenueCents / 100;

  // LTV = ARPA / monthly churn. Undefined when churn is 0 or there is no active
  // base to derive ARPA from — return null so the UI shows "—" instead of ∞.
  const arpa = activeCount > 0 ? mrr / activeCount : 0;
  const ltv = churnRate && churnRate > 0 ? arpa / churnRate : null;

  return { mrr, arr, grossRevenue, netRevenue, ltv };
});

export type GetMrrOutput = inferProcedureOutput<typeof getMrr>;
