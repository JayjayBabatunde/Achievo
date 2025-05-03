
export default function GoalHeader() {
  return (
    <div className='w-full sm:p-4  transition-all duration-500 ease-in-out'>
      <div className="flex justify-center items-start md:items-center p-2 mt-6 gap-4">
        {/* <h2 className="sm:text-2xl text-[16px] font-bold text-start">My Goals</h2> */}

        <input className="border p-2 md:w-1/3 w-full rounded-md"
          type='text' placeholder='Search goals...' />
      </div>
    </div>
  )
}
