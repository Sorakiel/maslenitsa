import { Avatar, Group, Header, SimpleCell } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'

interface CollectedPuzzle {
	id: number
	title: string
	score: number
	time: string
}

export const CollectedPuzzles = () => {
	const [collectedPuzzles, setCollectedPuzzles] = useState<CollectedPuzzle[]>(
		[]
	)

	useEffect(() => {
		// Загрузка собранных пазлов из локального хранилища
		const puzzles = JSON.parse(localStorage.getItem('collectedPuzzles') || '[]')
		setCollectedPuzzles(puzzles)
	}, [])

	return (
		<Group header={<Header>Собранные пазлы</Header>}>
			{collectedPuzzles.map((puzzle, index) => (
				<SimpleCell
					key={index}
					before={<Avatar size={40} />}
					subtitle={`${puzzle.time} мин`}
					after={`${puzzle.score}/10 баллов`}
				>
					{puzzle.title}
				</SimpleCell>
			))}
		</Group>
	)
}
