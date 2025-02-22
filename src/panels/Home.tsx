import { Button, Card, CardGrid, Group, Spinner } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import ApiService from '../services/api'
import { PuzzleItem } from '../types'
import PuzzleGame from './PuzzleGame'

interface PuzzleData {
	id: number
	name: string
	image: string
	assembled: boolean
	score: number | null
	time_spent: number | null
}

const Home = () => {
	const [puzzles, setPuzzles] = useState<PuzzleData[]>([])
	const [selectedPuzzle, setSelectedPuzzle] = useState<PuzzleItem | null>(null)
	const [isPuzzleGameActive, setIsPuzzleGameActive] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchPuzzles = async () => {
			try {
				const puzzlesData = await ApiService.getPuzzlesInfo()
				setPuzzles(puzzlesData)
			} catch (error) {
				console.error('Error fetching puzzles:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchPuzzles()
	}, [])

	const handlePuzzleSelect = (puzzle: PuzzleData) => {
		const puzzleItem: PuzzleItem = {
			id: puzzle.id,
			title: puzzle.name,
			image: puzzle.image,
			difficulty: 'easy',
			pieces: Array.from({ length: 36 }, (_, pieceIndex) => `${pieceIndex}`),
		}
		setSelectedPuzzle(puzzleItem)
		setIsPuzzleGameActive(true)
	}

	const handleGameEnd = async (score: number, timeLeft: number) => {
		setIsPuzzleGameActive(false)
		// Обновляем список пазлов после завершения игры
		try {
			const puzzlesData = await ApiService.getPuzzlesInfo()
			setPuzzles(puzzlesData)
		} catch (error) {
			console.error('Error updating puzzles:', error)
		}
	}

	if (loading) {
		return (
			<Group>
				<div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
					<Spinner size='l' />
				</div>
			</Group>
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
								alt={puzzle.name}
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
								<h3>{puzzle.name}</h3>
								{puzzle.assembled ? (
									<div style={{ fontSize: '14px', color: '#818C99' }}>
										Собран: {puzzle.score}/10
									</div>
								) : (
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
								)}
							</div>
						</Card>
					))}
				</CardGrid>
			)}
		</Group>
	)
}

export default Home
