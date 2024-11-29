import  FilterSection from "./FilterSection.js";

const departments = ["Computer Science", "Geographic Information Systems"];
const tags = ["AI", "Machine Learning", "Systems", "Career", "Networking"];

export const FiltersPanel = ({
  selectedDepartments, 
  setSelectedDepartments,
  selectedTags,
  setSelectedTags,
 }) => (
  <div className="space-y-6 bg-white rounded-xl shadow-sm p-6">
    <div className="border-b pb-4">
      <h2 className="text-lg font-semibold text-blue-900">Filters</h2>
      <p className="text-sm text-gray-500 mt-1">Refine event results</p>
    </div>
 
    <div className="space-y-6">
      <FilterSection
        title="Academic Department"
        items={departments}
        selected={selectedDepartments}
        onChange={setSelectedDepartments}
      />
      
      <div className="border-t pt-6">
        <FilterSection
          title="Event Topics"
          items={tags}
          selected={selectedTags}
          onChange={setSelectedTags}
        />
      </div>
    </div>
 
    {(selectedDepartments.length > 0 || selectedTags.length > 0) && (
      <button
        onClick={() => {
          setSelectedDepartments([]);
          setSelectedTags([]);
        }}
        className="w-full mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 
          border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Clear All Filters
      </button>
    )}
  </div>
 );
 