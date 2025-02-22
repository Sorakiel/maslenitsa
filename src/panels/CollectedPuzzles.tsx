import { Group, Header, SimpleCell } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import ApiService from '../services/api'

export interface CollectedPuzzle {
	id: number
	name: string
	image: string
	assembled: boolean
	score: number | null
	time_spent: number | null
}

const CollectedPuzzles = () => {
	const [collectedPuzzles, setCollectedPuzzles] = useState<CollectedPuzzle[]>(
		[]
	)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchPuzzles = async () => {
			try {
				const puzzles = await ApiService.getPuzzlesInfo()
				// Фильтруем только собранные пазлы
				const assembled = puzzles.filter(puzzle => puzzle.assembled)
				setCollectedPuzzles(assembled)
			} catch (error) {
				console.error('Error fetching collected puzzles:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchPuzzles()
	}, [])

	const formatTime = (timeInSeconds: number | null) => {
		if (timeInSeconds === null) return 'Время не записано'
		const minutes = Math.floor(timeInSeconds / 60)
		const seconds = timeInSeconds % 60
		return `Собрано за: ${minutes} мин ${seconds} сек`
	}

	if (loading) {
		return (
			<Group>
				<div>Загрузка...</div>
			</Group>
		)
	}

	return (
		<Group header={<Header>Собранные пазлы</Header>}>
			{collectedPuzzles.length === 0 ? (
				<div style={{ padding: 20, textAlign: 'center' }}>
					Пока нет собранных пазлов
				</div>
			) : (
				collectedPuzzles.map(puzzle => (
					<SimpleCell
						key={puzzle.id}
						before={
							<img
								src={puzzle.image}
								alt={puzzle.name}
								style={{ width: 40, height: 40, borderRadius: '8px' }}
							/>
						}
						subtitle={formatTime(puzzle.time_spent)}
						after={puzzle.score ? `${puzzle.score}/10 баллов` : 'Нет баллов'}
					>
						{puzzle.name}
					</SimpleCell>
				))
			)}
		</Group>
	)
}

export default CollectedPuzzles
