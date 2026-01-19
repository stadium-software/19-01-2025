# Story: Notifications on Approval Actions

**Epic:** Epic 8: Multi-Level Approval Workflow
**Story:** 16 of 16

## User Story

**As a** team member
**I want** to receive notifications when approvals or rejections occur
**So that** I can take timely action

## Acceptance Tests

### Happy Path
- [ ] Given I am a Level 2 approver, when Level 1 approval completes, then I receive an email notification "Batch ready for Level 2 approval"
- [ ] Given I submitted a batch, when it is rejected, then I receive notification with rejection reason
- [ ] Given final approval occurs, when L3 approves, then all stakeholders receive "Batch approved - published" notification

### Edge Cases
- [ ] Given a user has disabled notifications, when approval occurs, then they do not receive email (but in-app notification still shows)

### Error Handling
- [ ] Given email service fails, when notification is triggered, then error is logged but approval still succeeds

## Implementation Notes
- Email templates for each approval level
- In-app notifications (bell icon with count)
- Notification preferences in user settings
- Queue-based email delivery (async)
