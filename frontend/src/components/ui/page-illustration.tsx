type PageIllustrationProps = {
  isGradient?: boolean;
  isGrid?:boolean;
}

export default function PageIllustration({isGradient = true, isGrid=true}: PageIllustrationProps){
    return(
        <>
        {isGrid && (<div
            className="absolute inset-0 z-0 opacity-50 pointer-events-none 
            bg-[url('../../public/grid.svg')] 
            bg-no-repeat 
            bg-auto 
            mask-[linear-gradient(to_right,transparent,black_20%,black_70%,transparent)] 
            [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_70%,transparent)]">
        </div>)}
        {/* Radial Gradients Layer */}
      {isGradient && (
        <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 80% at 0% 18%, #F8F2E1 0%, rgba(255, 255, 255, 0) 70%),
            radial-gradient(ellipse 80% 80% at 100% 18%, #F8F2E1 0%, rgba(255, 255, 255, 0) 70%)
          `,
        }}
      ></div>
      )}
      </>
    )
    
    
}