import { Button, Group, Header } from '@vkontakte/vkui'
import { useEffect, useState } from 'react'
import { PuzzleItem } from '../types'

interface PuzzleGameProps {
	puzzle: PuzzleItem
	onGameEnd: (score: number, timeLeft: number) => void
}

export const PuzzleGame = ({ puzzle, onGameEnd }: PuzzleGameProps) => {
	const [timeLeft, setTimeLeft] = useState(120) // 2 минуты
	const [isCompleted, setIsCompleted] = useState(false)
	const [pieces, setPieces] = useState<number[]>([])

	useEffect(() => {
		// Инициализация пазла
		const shuffledPieces = shuffleArray([...Array(16).keys()]) // Пример для 4x4 пазла
		setPieces(shuffledPieces)
	}, [puzzle])

	useEffect(() => {
		if (timeLeft > 0 && !isCompleted) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		} else if (timeLeft === 0) {
			onGameEnd(10, 0) // Утешительные баллы
		}
	}, [timeLeft, isCompleted, onGameEnd])

	const handleCompletePuzzle = () => {
		setIsCompleted(true)
		const score = timeLeft > 0 ? (timeLeft === 120 ? 50 : 25) : 10
		onGameEnd(score, timeLeft)
	}

	const shuffleArray = (array: number[]) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1))
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	return (
		<Group header={<Header>{puzzle.title}</Header>}>
			<div className='puzzle-container'>
				{pieces.map((piece, index) => (
					<div key={index} className='puzzle-piece'>
						<img
							src={`/assets/puzzles/piece_${piece}.jpg`}
							alt={`Piece ${piece}`}
							style={{ width: '100%', height: '100%' }}
						/>
					</div>
				))}
			</div>
			<Button onClick={handleCompletePuzzle}>Готово</Button>
			<div>Оставшееся время: {timeLeft} секунд</div>
		</Group>
	)
}
