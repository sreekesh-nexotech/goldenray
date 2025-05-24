export default function PageIllustration(){
    return(
        <div
            className="absolute inset-0 z-0 opacity-50 pointer-events-none 
            bg-[url('../../public/grid.svg')] 
            bg-no-repeat 
            bg-auto 
            mask-[linear-gradient(to_right,transparent,black_20%,black_70%,transparent)] 
            [-webkit-mask-image:linear-gradient(to_right,transparent,black_20%,black_70%,transparent)]">
        </div>
    )
    
    
}