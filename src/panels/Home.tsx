import { Button, Card, CardGrid, Group, Header } from '@vkontakte/vkui'
import { useState } from 'react'
import { PuzzleItem } from '../types'

const puzzles: PuzzleItem[] = Array.from({ length: 12 }, (_, index) => ({
	id: index,
	image: `/assets/puzzles/puzzle_${index}.jpg`,
	title: `Пазл ${index + 1}`,
	difficulty: 'easy',
}))

export const Home = () => {
	const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleItem | null>(null)

	const handlePuzzleSelect = (puzzle: PuzzleItem) => {
		setSelectedPuzzle(puzzle)
	}

	return (
		<Group header={<Header>Пазлы</Header>}>
			<CardGrid size='l'>
				{puzzles.map(puzzle => (
					<Card
						key={puzzle.id}
						onClick={() => handlePuzzleSelect(puzzle)}
						style={{
							display: 'flex',
							alignItems: 'center',
							border:
								selectedPuzzle?.id === puzzle.id ? '2px solid #2688eb' : 'none',
						}}
					>
						<img
							src={puzzle.image}
							alt={puzzle.title}
							style={{ width: '80px', height: '80px', objectFit: 'cover' }}
						/>
						<div style={{ paddingLeft: 10 }}>
							<h3>{puzzle.title}</h3>
							<Button
								size='m'
								mode='primary'
								onClick={() => console.log('Собрать пазл')}
							>
								Собрать
							</Button>
						</div>
					</Card>
				))}
			</CardGrid>
		</Group>
	)
}
