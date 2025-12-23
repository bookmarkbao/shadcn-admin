CREATE TABLE user_expressions (
id TEXT PRIMARY KEY,
-- 表达本体
expression TEXT NOT NULL, -- 常用表达 / 句子 / 词组
meaning TEXT, -- 中文或你的理解
note TEXT, -- 使用备注（可空）
-- 能力阶梯（用户手动判断）
status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered', 'fluent','transferable','ignored')),
-- 行为参考（不负责判断，只记录）
practice_count INTEGER NOT NULL DEFAULT 0, -- 主动练习次数
usage_count INTEGER NOT NULL DEFAULT 0, -- 实际使用次数（如直播）
-- 场景标签（简单方案）
tags TEXT, -- 逗号分隔：日常,直播,购物
-- 时间
added_at INTEGER NOT NULL,
updated_at INTEGER NOT NULL
);
