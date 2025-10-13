Redux là gì?

- Single source of truth: Toàn bộ state của ứng dụng được lưu trong một store duy nhất.
- State is read-only: Chỉ có thể thay đổi state thông qua việc dispatch action (đối tượng mô tả sự kiện).
- Changes are made with pure functions: Việc cập nhật state được thực hiện trong reducer – các hàm thuần (pure function) nhận vào state cũ và action, trả về state mới.
- Redux rất mạnh mẽ nhưng ban đầu khá “lủng củng” bởi phải tự viết action-type, action creator, switch-case reducer, cấu hình store…

https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif
"# flowerplus.ui" 
