import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { data } from "@/data/data.js";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePathname } from "expo-router";

export default function Index() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState(data);
  function handleAdd() {
    if (text.trim()) {
      setTodos([
        { id: Math.random(), title: text, completed: false },
        ...todos,
      ]);
      setText("");
    }
  }
  function handleDelete(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }
  function handleCompleted(id) {
    const updatedTodos = todos.map((todo) =>
      todo.id == id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <TextInput
            style={styles.input}
            placeholder="Add a new todo"
            value={text}
            onChangeText={setText}
          ></TextInput>
          <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
            Add
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Pressable onPress={() => handleCompleted(item.id)}>
                <Text
                  style={[
                    styles.itemText,
                    item.completed ? styles.completedText : null,
                  ]}
                >
                  {item.title}
                </Text>
              </Pressable>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    fontSize: 16,
    paddingLeft: 10,
    outlineWidth: 0,
  },
  addButton: {
    color: "white",
    height: 40,
    width: 80,
    backgroundColor: "blue",
    textAlign: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  itemContainer: {
    widht: "100%",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    color: "black",
    fontWeight: "semibold",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "grey",
  },
});
