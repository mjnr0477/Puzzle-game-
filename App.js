import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from "react-native";

const SIZE = 3; // 3x3 puzzle

const shuffle = (array) => {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const createBoard = () => {
  let nums = Array.from({ length: SIZE * SIZE }, (_, i) => i);
  return shuffle(nums);
};

export default function App() {
  const [board, setBoard] = useState(createBoard());
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const resetGame = () => {
    setBoard(createBoard());
    setMoves(0);
    setSeconds(0);
  };

  const moveTile = (index) => {
    const emptyIndex = board.indexOf(0);
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    const emptyRow = Math.floor(emptyIndex / SIZE);
    const emptyCol = emptyIndex % SIZE;

    if (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    ) {
      let newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
      setMoves((prev) => prev + 1);

      if (newBoard.every((num, i) => num === i)) {
        Alert.alert(
          "🎉 You Won! 🎉",
          `Solved in ${moves + 1} moves and ${seconds} seconds.`,
          [{ text: "Play Again", onPress: resetGame }]
        );
      }
    }
  };

  const renderTile = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.tile, item === 0 && styles.emptyTile]}
      onPress={() => moveTile(index)}
    >
      {item !== 0 && <Text style={styles.tileText}>{item}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sliding Puzzle</Text>
      <Text style={styles.stats}>Moves: {moves} | Time: {seconds}s</Text>
      <FlatList
        data={board}
        renderItem={renderTile}
        keyExtractor={(_, index) => index.toString()}
        numColumns={SIZE}
        scrollEnabled={false}
        contentContainerStyle={styles.board}
      />
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Reset Game</Text>
      </TouchableOpacity>
    </View>
  );
}

const TILE_SIZE = 100;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#2c3e50" },
  stats: { fontSize: 16, marginBottom: 20, color: "#34495e" },
  board: { justifyContent: "center", alignItems: "center" },
  tile: { width: TILE_SIZE, height: TILE_SIZE, backgroundColor: "#3498db", justifyContent: "center", alignItems: "center", margin: 2, borderRadius: 10 },
  emptyTile: { backgroundColor: "#ecf0f1" },
  tileText: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  resetButton: { marginTop: 20, backgroundColor: "#e74c3c", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  resetText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
