export default function Dashboard() {
  return (
    <div className="w-[100%]">
      <div className="bg-black">Menu</div>
      <div className="lg: flex justify-center w-[100%]">
        <div className="flex flex-col gap-4 p-6 md:p-12 lg:grid grid-cols-7 w-[100%] max-w-[1600px]">
          <div className="hidden md:block">
            <div class="bg-white">SideMenu / TabletMenu</div>
          </div>
          <div className="flex flex-col gap-4 col-span-4">
            <div className="bg-primary">Cards principais</div>
          </div>
          <div className="hidden md:block h-[100%] bg-secondary col-span-2">
            Transações
          </div>
        </div>
      </div>
    </div>
  );
}
