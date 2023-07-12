import EquipmentDisplay from '@/components/equipment-display'

export default function Home() {
  return (
    <main>
      <div className="flex justify-center pt-5 mb-4">
        <h1 className="text-5xl">grimoire</h1>
      </div>
      <EquipmentDisplay></EquipmentDisplay>
    </main>
  )
}
