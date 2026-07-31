import type { Organization } from "@/features/auth/types";

/**
 * Mirrors backend/internal/delivery/http/v1/dto.go's Admin* response
 * shapes exactly — see AdminHandler and repository.OrganizationSummary/
 * PlatformStats for the source of truth.
 */
export interface AdminOrganization {
  organization: Organization;
  member_count: number;
  plan_code?: string | null;
  subscription_status?: string | null;
}

export interface AdminPlanSubscriptionCount {
  plan_code: string;
  plan_name: string;
  count: number;
}

/**
 * mrr_cents_approx is a labeled estimate, not a precise revenue figure —
 * see the backend DTO's doc comment (repository.PlatformStats.
 * MRRCentsApprox) for why a subscription's actual billing period
 * (monthly/yearly) isn't known, so this always uses the monthly price.
 */
export interface AdminPlatformStats {
  total_organizations: number;
  total_users: number;
  total_conversations: number;
  total_messages: number;
  active_subscriptions: number;
  mrr_cents_approx: number;
  subscriptions_by_plan: AdminPlanSubscriptionCount[];
}

/**
 * No field for the key itself — the backend never returns it once set
 * (write-only, same principle as a password field). See
 * platformsettings.GeminiKeyStatus's doc comment.
 */
export interface AdminGeminiSettings {
  configured: boolean;
  updated_at?: string | null;
}
