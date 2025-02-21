import { Button, Card, CardGrid, Group } from '@vkontakte/vkui'
import { lazy, useState } from 'react'
import { PuzzleItem } from '../types'

const puzzles: PuzzleItem[] = Array.from({ length: 12 }, (_, index) => ({
	id: index,
	image: `/assets/puzzles/puzzle_${index}.jpg`,
	title: `Пазл ${index + 1}`,
	difficulty: 'easy',
}))

const PuzzleGame = lazy(() => import('./PuzzleGame'))

const Home = () => {
	const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleItem | null>(null)
	const [isPuzzleGameActive, setIsPuzzleGameActive] = useState(false)

	const handlePuzzleSelect = (puzzle: PuzzleItem) => {
		setSelectedPuzzle(puzzle)
		setIsPuzzleGameActive(true)
	}

	const handleGameEnd = (score: number, timeLeft: number) => {
		setIsPuzzleGameActive(false)
		console.log(
			`Игра завершена. Баллы: ${score}, Оставшееся время: ${timeLeft}`
		)
	}

	return (
		<Group>
			{isPuzzleGameActive && selectedPuzzle ? (
				<PuzzleGame puzzle={selectedPuzzle} onGameEnd={handleGameEnd} />
			) : (
				<CardGrid size='l'>
					{puzzles.map(puzzle => (
						<Card
							key={puzzle.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								border:
									selectedPuzzle?.id === puzzle.id
										? '2px solid #2688eb'
										: 'none',
								cursor: 'default',
								padding: '10px',
							}}
						>
							<img
								src={puzzle.image}
								alt={puzzle.title}
								style={{
									width: '80px',
									height: '80px',
									objectFit: 'cover',
									borderRadius: '8px',
									marginLeft: '10px',
								}}
							/>
							<div
								style={{
									paddingLeft: 10,
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									height: '80px',
								}}
							>
								<h3>{puzzle.title}</h3>
								<Button
									size='m'
									mode='primary'
									style={{
										backgroundColor: '#2688eb',
										color: '#ffffff',
										width: '100px',
										marginBottom: '10px',
									}}
									onClick={() => handlePuzzleSelect(puzzle)}
								>
									Собрать
								</Button>
							</div>
						</Card>
					))}
				</CardGrid>
			)}
		</Group>
	)
}

export default Home
