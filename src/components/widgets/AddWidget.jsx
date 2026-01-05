const AddWidget = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-dashed border-gray-200 hover:border-yellow-400 transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[250px]">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <p className="text-sm text-gray-600 font-medium">Add widget</p>
    </div>
  )
}

export default AddWidget

