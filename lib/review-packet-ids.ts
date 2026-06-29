export const REVIEW_TRADING_BOUNDARY_COPY_ID = "review-trading-boundary-copy";

export function isPreservedTradingReviewPacketId(value: string | null): value is typeof REVIEW_TRADING_BOUNDARY_COPY_ID {
  return value === REVIEW_TRADING_BOUNDARY_COPY_ID;
}
