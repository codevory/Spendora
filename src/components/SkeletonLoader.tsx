const SkeletalLoader = () => {
  return (
<div className="skeleton-parent">
    <div className="skeleton-card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ">
        <span className="skeleton-card"></span>
        <span className="skeleton-card"></span>
        <span className="hidden md:block skeleton-card"></span>
        <span className="hidden md:block skeleton-card"></span>
      </div>

     <div className="skeleton-main-container">

        <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1 w-1/2 skeleton-text-graph">
              <span className="skeleton-text long"></span>
              <span className="skeleton-text short"></span>
            </div>

          <div className="flex gap-2 w-1/2">
            <span className="skeleton-btns"></span>
            <span className="skeleton-btns"></span>
            <span className="skeleton-btns"></span>
          </div>
        </div>

     <div className=" flex gap-2 justify-between skeleton-bottom ">
      {/* graphs */}
        <div className="skeleton-graph-container w-[60%]">
          <span className="skeleton-pillar"></span>
          <span className="skeleton-pillar"></span>
          <span className="skeleton-pillar"></span>
          <span className="skeleton-pillar"></span>
          <span className="skeleton-pillar"></span>
          <span className="skeleton-pillar common"></span>
          <span className="skeleton-pillar common"></span>
        </div>
 
          {/* form */}
            <div className="flex flex-col gap-2 skeleton-form w-[40%]">
             <div className="flex flex-col">
                <label className="skeleton-text short"></label>
                <span className="skeleton-input"></span>
              </div>
              <div className="flex flex-col">
                <label className="skeleton-text short"></label>
                <span className="skeleton-input"></span>
              </div>
              <div className="flex flex-col">
                <label className="skeleton-text short"></label>
                <span className="skeleton-input"></span>
              </div>
                {/* button */}
                <span className="skeleton-btn"></span>
              </div>
            </div>
    </div>
</div>
  )
}

export default SkeletalLoader
