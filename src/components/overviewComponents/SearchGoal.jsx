
export default function SearchGoal({ search, setSearch }) {
  return (
    <div className='w-full sm:p-4  transition-all duration-500 ease-in-out'>
      <div className="flex justify-center items-start md:items-center p-2 mt-6 gap-4">

        <input className="border p-2 md:w-1/3 w-full rounded-md text-black"
          type='text' placeholder='Search goals...' value={search} onChange={e => setSearch(e.target.value)} />
      </div>
    </div>
  )
}
