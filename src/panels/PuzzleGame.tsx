import {
	Button,
	HorizontalScroll,
	ModalPage,
	ModalPageHeader,
	ModalRoot,
} from '@vkontakte/vkui'
import React, { useEffect, useState } from 'react'
import ApiService from '../services/api'
import './PuzzleGame.css' // Добавьте стили для компонента

interface PuzzleGameProps {
	puzzle: { id: number; title: string; pieces: string[] }
	onGameEnd: (score: number, timeLeft: number) => void
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({ puzzle, onGameEnd }) => {
	const [timeLeft, setTimeLeft] = useState(120) // 2 минуты
	const [piecesPosition, setPiecesPosition] = useState<string[]>(
		Array(36).fill(null)
	) // 6x6 поле
	const [availablePieces, setAvailablePieces] = useState<string[]>(
		puzzle.pieces.map(
			(_, index) => `assets/pieces/puzzle_${puzzle.id}/piece (${index + 1}).png`
		)
	) // Доступные кусочки
	const [selectedPiece, setSelectedPiece] = useState<string | null>(null) // Выбранный кусочек
	const [isGameFinished, setIsGameFinished] = useState(false)
	const [modalOpened, setModalOpened] = useState(false) // Состояние для управления модальным окном
	const [modalContent, setModalContent] = useState('') // Содержимое модального окна

	useEffect(() => {
		const timer = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(timer)
					handleGameEnd()
					return 0
				}
				return prev - 1
			})
		}, 1000)
		return () => clearInterval(timer)
	}, [])

	const handlePieceSelect = (piece: string) => {
		setSelectedPiece(piece) // Устанавливаем выбранный кусочек
	}

	const handleCellClick = (index: number) => {
		if (selectedPiece) {
			const newPosition = [...piecesPosition]
			const existingPiece = newPosition[index]

			if (existingPiece) {
				// Если ячейка занята, возвращаем заменяемый кусочек в карусель
				setAvailablePieces(prev => [...prev, existingPiece])
			}

			// Устанавливаем новый кусочек
			newPosition[index] = selectedPiece
			setPiecesPosition(newPosition)
			setAvailablePieces(prev => prev.filter(p => p !== selectedPiece)) // Убираем выбранный кусочек из карусели
			setSelectedPiece(null) // Сбрасываем выбранный кусочек
		}
	}

	const handleGameEnd = async () => {
		const expectedPieces = Array.from(
			{ length: 36 },
			(_, i) => `piece (${i + 1}).png`
		)

		if (
			piecesPosition.every((piece, index) => {
				if (!piece) return false
				const pieceName = piece.split('/').pop()?.replace(/%20/g, ' ')
				return pieceName === expectedPieces[index]
			})
		) {
			setIsGameFinished(true)
			const score = calculateScore()
			const timeSpent = 120 - timeLeft

			try {
				await ApiService.savePuzzleResult({
					puzzle_id: puzzle.id,
					score,
					time_spent: timeSpent,
				})

				setModalContent(
					`Успех! Пазл собран за: ${Math.floor(timeSpent / 60)} мин ${
						timeSpent % 60
					} сек. Вы получили: ${score}/10 баллов`
				)
				setModalOpened(true)

				setTimeout(() => {
					onGameEnd(score, timeLeft)
				}, 2000)
			} catch (error) {
				console.error('Error saving puzzle result:', error)
				setModalContent('Произошла ошибка при сохранении результата')
				setModalOpened(true)
			}
		} else {
			setModalContent(
				'Время вышло! Не переживай, ты всегда можешь попробовать снова!'
			)
			setModalOpened(true)
		}
	}

	const calculateScore = () => {
		const maxScore = 10
		const timeUsed = 120 - timeLeft // Время, затраченное на сборку
		const score = Math.max(0, maxScore - Math.floor(timeUsed / 12)) // 10 очков за 0 минут, 0 очков за 120 секунд
		return Math.min(score, maxScore) // Убедитесь, что очки не превышают 10
	}

	const closeModal = () => {
		setModalOpened(false) // Закрываем модальное окно
	}

	return (
		<div>
			<div className='header'>{puzzle.title}</div>
			<div className='timer'>{`Оставшееся время: ${String(
				Math.floor(timeLeft / 60)
			).padStart(2, '0')}:${String(timeLeft % 60).padStart(2, '0')}`}</div>
			<div className='puzzle-field'>
				{piecesPosition.map((piece, index) => (
					<div
						key={index}
						className='puzzle-cell'
						onClick={() => handleCellClick(index)} // Обработчик нажатия на ячейку
					>
						{piece && <img src={piece} alt={`Piece ${piece}`} />}
					</div>
				))}
			</div>
			<HorizontalScroll>
				{availablePieces.map((piece, index) => (
					<img
						className={`piece-horizontal-scroll ${
							selectedPiece === piece ? 'selected' : ''
						}`}
						key={index}
						src={piece}
						alt={`Piece ${piece}`}
						onClick={() => handlePieceSelect(piece)} // Обработчик нажатия на кусочек
					/>
				))}
			</HorizontalScroll>
			<Button
				onClick={handleGameEnd}
				disabled={isGameFinished}
				className='finish-button'
			>
				Готово
			</Button>

			{/* Модальное окно */}
			<ModalRoot activeModal={modalOpened ? 'success' : null}>
				<ModalPage id='success' onClose={closeModal}>
					<ModalPageHeader>
						<h2>Результат</h2>
					</ModalPageHeader>
					<div style={{ padding: '16px' }}>{modalContent}</div>
					<Button onClick={closeModal} style={{ margin: '16px' }}>
						Закрыть
					</Button>
				</ModalPage>
			</ModalRoot>
		</div>
	)
}

export default PuzzleGame
