/**
 * detects when a (CSS) sticky element changes "sticky" state
 * @param {object} ref optional react ref. if not provided, a new one will be used instead.
*/
const useDetectSticky = (ref) => {
  const [isSticky, setIsSticky] = useState(false)
  const newRef = useRef()
  ref ||= newRef;
  
   // mount 
  useEffect(()=>{
    const cachedRef = ref.current,
          observer = new IntersectionObserver(
            ([e]) => setIsSticky(e.intersectionRatio < 1),
            {
              threshold: [1],
              // rootMargin: '-1px 0px 0px 0px',  // alternativly, use this and set `top:0` in the CSS
            }
          )

    observer.observe(cachedRef)
    
    // unmount
    return () => {
      observer.unobserve(cachedRef)
    }
  }, [])
  
  return [isSticky, ref, setIsSticky];
}
