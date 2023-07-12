import EquipmentCardList from '@/components/equipment-card-list'

export default function Home() {
  return (
    <main>
      <div className="flex justify-center pt-5 mb-4">
        <h1 className="text-5xl">grimoire</h1>
      </div>
      <div className="grid grid-cols-2">
        <div className="pl-5">equipment list will go here</div>
        <div>
          <EquipmentCardList></EquipmentCardList>
        </div>
      </div>
    </main>
  )
}
