import EquipmentDisplay from '@/components/equipment-display'

export default function Home() {
  return (
    <main className="h-screen">
      <div className="h-1/6 flex justify-center ">
        <h1 className="pt-5 mb-4 text-5xl">grimoire</h1>
      </div>
      <div className="h-5/6">
        <EquipmentDisplay></EquipmentDisplay>
      </div>
    </main>
  )
}
