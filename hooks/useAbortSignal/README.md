## Usage Example

```jsx
import useAbortSignal from 'hooks/useAbortSignal';

const MyComp = () => {
    const signal = useAbortSignal()

    // fetch initial component data
    useEffect(() => {
        fetch('/api/getData', {signal})
            .then(res => ...)
    }, [])

    // re-use same signal when updating the API
    const setData = async data => {
        try {
            const response = await fetch('/api/setData', {
                method: "POST", 
                body: JSON.stringify(data), 
                signal
            });

            if( !response.ok ) 
              // ...
        }
    }

    // ...component logic
}

```
