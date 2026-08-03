
export const initGlobalErrorHandling = () => {
    window.addEventListener("error", (event) => {
        if(event.target instanceof HTMLElement){
            console.error("error caught : ", event.target)
            return
        }
    })

    window.addEventListener("unhandledrejection", (event) => {
       console.error("unhandled rejection error : ", event.target)
       return;
    })

    window.addEventListener("error",(event) => {
        if(event.target instanceof HTMLElement){
        console.error("REsource_Error : ",event.target)
        }
    },
    true
  )
   
}