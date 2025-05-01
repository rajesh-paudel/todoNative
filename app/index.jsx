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
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Octicons } from "@expo/vector-icons";
import Animated, { LinearTransition } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Index() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [loaded, error] = useFonts({
    Inter_500Medium,
  });
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp");
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos);
        } else {
          setTodos(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [data]);

  useEffect(() => {
    const storeData = async () => {
      try {
        const jsonValue = JSON.stringify(todos);
        await AsyncStorage.setItem("TodoApp", jsonValue);
      } catch (error) {
        console.error(error);
      }
    };
    storeData();
  }, [todos]);
  if (!loaded && !error) {
    return null;
  }
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
  const styles = createStyles(theme, colorScheme);
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
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
            <Text style={{ color: "white", textAlign: "center" }}> Add</Text>
          </TouchableOpacity>
          <Pressable
            onPress={() =>
              setColorScheme(colorScheme == "light" ? "dark" : "light")
            }
            style={{ marginLeft: 10 }}
          >
            <Octicons
              name={colorScheme == "dark" ? "moon" : "sun"}
              size={36}
              color={theme.text}
            />
          </Pressable>
        </View>

        <Animated.FlatList
          data={todos}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          itemLayoutAnimation={LinearTransition}
          keyboardDismissMode="on-drag"
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
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.background,
    },
    input: {
      width: "80%",
      color: theme.text,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? "white" : "black",
      borderRadius: 5,
      fontSize: 16,
      paddingLeft: 10,
      outlineWidth: 0,
      fontFamily: "Inter_500Medium",
    },
    addButton: {
      color: "white",
      height: 50,
      width: 80,
      backgroundColor: theme.button,
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
      color: theme.text,
      fontWeight: "semibold",
      fontFamily: "Inter_500Medium",
    },
    completedText: {
      textDecorationLine: "line-through",
      color: "grey",
    },
  });
}
