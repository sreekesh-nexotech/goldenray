type PageIllustrationProps = {
  isGradient?: boolean;
  isGrid?: boolean;
  gridScale?: number;
};

export default function PageIllustration({
  isGradient = true,
  isGrid = true,
  gridScale = 100,
}: PageIllustrationProps) {
  return (
    <>
      {isGrid && (
        <div
          className="absolute inset-0 z-0 opacity-50 pointer-events-none 
            bg-[url('../../public/grid.svg')] 
            bg-repeat-x 
            bg-center"
          style={{
            backgroundSize: `${gridScale}% auto`,
            mask: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMask:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        ></div>
      )}
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
  );
}
