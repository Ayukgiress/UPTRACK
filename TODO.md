# Task: Fix Pending, Completed, and Analytics to Include Assigned Tasks

## Overview
The pending tasks, completed tasks, and analytics (charts) pages currently only show tasks created by the user. They should also include tasks assigned to the user, similar to how the Overview page works.

## Steps to Complete

### 1. Update Pending.jsx
- [x] Modify `fetchPendingTodos` function to fetch both created and assigned todos
- [x] Combine the results and remove duplicates
- [x] Filter for pending tasks (!todo.completed)

### 2. Update Completed.jsx
- [x] Modify `fetchCompletedTodos` function to fetch both created and assigned todos
- [x] Combine the results and remove duplicates
- [x] Filter for completed tasks (todo.completed)

### 3. Update Charts.jsx
- [x] Modify `fetchAnalytics` function to fetch both created and assigned todos
- [x] Combine the results and remove duplicates
- [x] Calculate analytics based on the combined todos

### 4. Testing
- [x] Test that pending page shows assigned pending tasks
- [x] Test that completed page shows assigned completed tasks
- [x] Test that charts/analytics include assigned tasks in calculations
- [x] Verify no duplicate tasks appear

### 5. Chat Notifications
- [x] Add unread message counter to chat icon
- [x] Add new message indicator in chat bubbles
- [x] Mark messages as read when opening chat
- [x] Update chat store with notification state
