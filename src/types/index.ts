export interface PuzzleItem {
	id: number
	image: string
	title: string
	difficulty: 'easy' | 'medium' | 'hard'
}

export interface LeaderboardEntry {
	userId: number
	name: string
	score: number
	puzzleId: number
	completionTime: number
}
