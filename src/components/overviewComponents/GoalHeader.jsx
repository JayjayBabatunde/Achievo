
export default function GoalHeader() {
  return (
    <div className='w-full p-4  transition-all duration-500 ease-in-out'>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 mt-6 gap-4">
      <h2 className="text-2xl font-bold text-start">My Goals</h2>

      <input className="border p-2 md:w-1/3 w-full rounded-md"
       type='text' placeholder='Search goals...' />
    </div>
    </div>
  )
}
