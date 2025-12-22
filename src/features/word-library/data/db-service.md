## 快速开始

1. 确保 API Server 已启用。
2. 访问 `http://127.0.0.1:23333/api/db/user_words?_limit=5`。
3. 任何成功响应都返回：
   ```json
   {
     "success": 1,
     "data": [...],
     "pages": { "page": 1, "pageSize": 5, "next": 2, ... }
   }
   ```
4. 错误响应包含 `success: 0` 与 `message` 描述。

## 端点

| 动作        | 方法   | 路径                 | 备注                           |
| ----------- | ------ | -------------------- | ------------------------------ |
| 列表 / 查询 | GET    | `/api/db/:table`     | 支持筛选、排序、分页           |
| 获取单条    | GET    | `/api/db/:table/:id` | 依据表的主键（仅支持单列主键） |
| 创建        | POST   | `/api/db/:table`     | body 为 JSON 对象              |
| 更新        | PUT    | `/api/db/:table/:id` | body 为要更新的列              |
| 删除        | DELETE | `/api/db/:table/:id` | 依据主键删除                   |
| 批量创建    | POST   | `/api/db/:table/batch` | body 为 JSON 数组（对象列表）  |
| 批量更新    | PATCH  | `/api/db/:table/batch` | body 为 JSON 数组（每项含主键） |
| 批量删除    | DELETE | `/api/db/:table/batch` | body 为 `{ ids: [...] }`       |
| 批量 Upsert | POST   | `/api/db/:table/batch-upsert` | body 为 `{ conflictKeys, items }` |
| 单条 Upsert | POST   | `/api/db/:table/upsert` | body 为 `{ conflictKeys, item }` |
## 受保护的表

为保护系统关键数据，下列表名无法访问：
`migrate, folders, folder_items, folder_stats, workspaces, media_files, subtitle_tracks, subtitle_lines, subtitle_fts, favorite_sentences, merge_projects, merge_clips, plugins, plugin_repos`

表名解析大小写不敏感；尝试访问受限表会返回 `403 Access to table "xxx" is restricted`。

## 查询参数

| 参数                  | 用法                                          | 示例                            |
| --------------------- | --------------------------------------------- | ------------------------------- |
| `column=value`        | 等值（重复参数会自动视为 IN）                 | `status=learning`, `status=new&status=mastered` |
| `column_ne=value`     | 不等于                                        | `status_ne=ignored`             |
| `column_in=value`     | IN（逗号分隔或重复参数）                      | `status_in=new,learning,mastered` |
| `column_gte=value`    | 大于等于                                      | `added_at_gte=1737446400000`    |
| `column_lte=value`    | 小于等于                                      | `added_at_lte=1737532800000`    |
| `column_like=keyword` | 模糊匹配（自动包裹 `%`）                      | `word_like=apple`               |
| `_order=col:asc`      | 排序，多字段用逗号分隔                        | `_order=added_at:desc,word:asc` |
| `_page=1`             | 页码，从 1 开始                               | `_page=2`                       |
| `_limit=50`           | 每页大小（1~500，默认为 50；设为 0 取消分页） | `_limit=100`                    |

分页响应中的 `pages` 字段包含 `page/ pageSize / next / previous / last / total`。

## 创建 / 更新

- Body 必须是 JSON 对象，字段名需满足 `/^[A-Za-z_][A-Za-z0-9_]*$/`。
- POST 会返回 `{ success: 1, id: <lastInsertRowId> }`；若主键为 `INTEGER PRIMARY KEY`, 会自动读取 `lastInsertRowid`。
- PUT/DELETE 若没有匹配行，会返回 `success:0, message:'No rows updated/deleted'`。

## Electron 插件环境提示

在 Electron 的 webview/远程页面中，浏览器的 PNA/CORS 规则可能阻止页面直接请求 `http://127.0.0.1:23333`。
此时可以使用 `window.$mapi.http.request({ path, method, body })` 由主进程代为转发到本机 API Server。