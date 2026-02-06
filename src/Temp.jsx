// 1. Functional Component (Foundation)

import React from 'react';
import { View, Text } from 'react-native';
// Just importing code

const App = () => {
// Declares a functional component.
// Arrow function returns UI.
// Functional components are mandatory for hooks.

    return (
    // Every component must return exactly one root element.

        <View>
            <Text>Hello</Text>
        </View>
    )
};

export default App;
// export default App; Makes this component available to the app entry point. Without default, app won't boot.


// 2. useState (State Management)

const [count, setCount] = useState(0);
// count → current state value.
// setCount → function to update state.
// 0 → initial value (runs only on first render).

setCount(prev => prev + 1);
// Uses functional update.
// prev guarantees latest value.
// Prevents bugs when multiple updates occur in same render cycle.
// setCount(count + 1) can fail in rapid updates.


// 3. useEffect (Side Effects)

useEffect(() => {
// Registers a side-effect.
// Runs after render, never during render.

    fetchData();
    // Side effects belong here (API calls, subscriptions).
    // Calling this in component body → infinite loop.

    return () => {
    // Cleanup function.
    // Runs before unmount or before next effect run.

        console.log('cleanup');
        // Example cleanup (unsubscribe, clear timer, remove listener).

    };
}, []);
// Empty dependency array → run once.
// This mimics componentDidMount.


// 4. Fetch API (Async Data)

const fetchData = async => {
// Declares async function.
// async allows await.

    try {
    // Wraps risky async logic.

        const res = await fetch(url);
        // fetch returns a Response object, not JSON.

        const json = await res.json();
        // Converts response body into JS object.
        // If you skip this → useless response.

        setData(json);
        // Triggers re-render with fetched data.

    } catch (e) {
    // Catches network / parsing errors.

        console.error(e);
        // Logs error for debugging.
        // In production, you’d show UI feedback.

    }
};


// 5. Conditional Rendering

{ loading ? <Loader /> : <Data /> }
// Ternary operator inside JSX.
// If loading is true → show loader.
// Else → show data.

{ isLoggedIn && <Dashboard /> }
// Short-circuit rendering.
// If false → renders nothing.
// Cleaner than ternary when no “else” UI.


// 6. FlatList (Large Lists)

<FlatList
    data={data}
    // Array of items.

    keyExtractor={item => item.id}
    // Unique key for reconciliation.
    // Prevents unnecessary re-renders.

    renderItem={({ item }) => <Text>{item.name}</Text>}
/>
{/*Function that renders one item.
Destructuring extracts item.
Using ScrollView here = performance suicide.*/}


// 7. Pressable (Touch Handling)

<Pressable onPress={() => alert('Pressed')}>
{/* Handles touch events.
Better accessibility than older APIs. */}

    <Text>Click</Text>
    {/* Touchable area content. */}

</Pressable>


// 8. Props(Data Flow)

const Child = ({ name }) => <Text>{name}</Text>;
// Destructures props.
// Props are read - only.

< Child name = "Lakshay" />
// Parent passes data down.
// Child cannot modify parent state directly.
// This enforces predictable UI.


// 9. Stylesheet

const styles = StyleSheet.create({
// Registers styles.
// Improves performance & validation.

    container: {
    // Named style object.

    flex: 1,
    // Occupies full screen.

    justifyContent: 'center',
    // Vertical alignment(column by default ).

    alignItems: 'center',
    // Horizontal alignment.

  },
});


// 10. Flexbox Row Layout

< View style = {{ flexDirection: 'row', justifyContent: 'space-between' }}>
</View>
{/* flexDirection: 'row' → horizontal layout.
space - between → pushes items to edges.
React Native uses Flexbox only. No grid. No floats. */}


// 11. TextInput 

    < TextInput
    // Native input field.

    value = { text }
    // Controlled input.
    // UI reflects state.

    onChangeText = { setText }
    />
    {/* Updates state on every keystroke. */}
    {/* Keeps input predictable. */}


// 12. Navigation 

navigation.navigate('Profile', { id: 1 });
// Pushes new screen onto stack.
// Second argument = params object.
// Params accessible via route.params.


// 13. Platform Check 

import { Platform } from 'react-native';
// Gives OS info.

    Platform.OS === 'android' ? doA() : doB();
    // Enables platform - specific logic.
    // Necessary due to native differences.


// 14. useRef

const inputRef = useRef(null);
// Holds mutable value.
// Changing it does not cause re - render.

    inputRef.current.focus();
    // Directly accesses native element.
    // Used for focus, timers, previous values.


// 15. useCallback

const handleClick = useCallback(() => {
// Memoizes function reference.

    console.log('clicked');
}, []);
// Prevents re - creation on every render.
// Critical when passing functions to child components.


// 16. Error Boundary

class ErrorBoundary extends React.Component {
// Class component(hooks don't support error boundaries yet).

    componentDidCatch(error) {
    // Lifecycle method for catching render errors.

        console.log(error);
        // Logs crash info.
  }

    render() {
    // Mandatory render method.

        return this.props.children;
        // Renders wrapped components.
        
  }
}