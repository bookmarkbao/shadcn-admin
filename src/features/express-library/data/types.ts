/**
 * 用户表达库（user_expressions）类型定义
 *
 * user_expressions 是全局、高频、强一致的用户核心资产数据。
 * 所有 WebView 必须基于统一同步结果进行判断，
 * 不允许出现任何局部或延迟不一致的情况。
 */

/**
 * 表达状态
 * - new: 刚加入（默认/未标记）
 * - learning: 我在学
 * - mastered: 我会了
 * - fluent: 我能顺畅用
 * - transferable: 我能迁移到更多场景
 * - ignored: 我不想管
 *
 * 注意：这是"用户态度"，不是算法结果
 */
export type UExpressionStatus =
  | 'new'
  | 'learning'
  | 'mastered'
  | 'fluent'
  | 'transferable'
  | 'ignored'

/**
 * 表达库命中状态（用于“查词/对比辞书”等临时计算，不落库）
 */
export type ExpressionLibraryHitStatus = 'in_library' | 'not_in_library'
/**
 * 用户表达
 */
export interface UExpression {
  /** 主键 */
  id: string
  /** 表达本体 */
  expression: string
  /** 中文或你的理解（可空） */
  meaning?: string | null
  /** 使用备注（可空） */
  note?: string | null
  /** 用户标记的状态 */
  status: UExpressionStatus
  /** 主动练习次数 */
  practiceCount: number
  /** 实际使用次数 */
  usageCount: number
  /** 场景标签（逗号分隔，可空） */
  tags?: string | null
  /** 加入时间（Unix ms） */
  addedAt: number
  /** 更新时间（Unix ms） */
  updatedAt: number
}
