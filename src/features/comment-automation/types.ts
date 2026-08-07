/** Mirrors backend/internal/delivery/http/v1/dto.go's
 * CommentAutomationResponse exactly. An org that has never configured this
 * gets enabled=false rather than a 404 — see the backend
 * commentautomation.UseCase.Get doc comment. */
export interface CommentAutomation {
  enabled: boolean;
  /** Absent means "private reply only" — no public reply is posted under
   * the comment itself. */
  public_reply_text?: string;
}
