/**
 * 用户词库（user_words）类型定义
 *
 * user_words 是全局、高频、强一致的用户核心资产数据。
 * 所有 WebView 必须基于统一同步结果进行判断，
 * 不允许出现任何局部或延迟不一致的情况。
 */

/**
 * 单词状态
 * - new: 刚加入（默认/未标记）
 * - learning: 我在学
 * - mastered: 我会了
 * - ignored: 我不想管
 *
 * 注意：这是"用户态度"，不是算法结果
 */
export type UWordStatus = 'new' | 'learning' | 'mastered' | 'ignored'

/**
 * 词库命中状态（用于“查词/对比辞书”等临时计算，不落库）
 */
export type WordLibraryHitStatus = 'in_library' | 'not_in_library'
/**
 * 用户词库单词
 */
export interface UWord {
  /** 英文单词（小写规范化，作为唯一标识） */
  word: string
  /** 用户标记的状态 */
  status: UWordStatus
  /** 加入词库时间（Unix ms） */
  addedAt: number
  /** 最近一次状态变化时间（Unix ms） */
  updatedAt: number
}
