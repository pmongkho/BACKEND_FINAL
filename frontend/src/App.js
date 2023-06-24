import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactDataGrid from '@inovua/reactdatagrid-enterprise'
import '@inovua/reactdatagrid-enterprise/index.css'
import Header from './components/Header'

function App() {
	const [states, setStates] = useState([])
	const [filteredList, setFilteredList] = useState(states)

	const filterBySearch = (e) => {
		// Access input value
		const query = e.target.value
		// Create copy of item list
		var updatedList = [...states]
		// Include all elements which includes the search query
		updatedList = updatedList.filter((item) => 
		{return	item.state.toLowerCase().indexOf(query.toLowerCase()) !==-1}
		)
		// Trigger render with updated values
		setFilteredList(updatedList)
	}

	useEffect(() => {
		getStates()
	}, [])

	const getStates = async () => {
		axios
			.get('http://localhost:8000/states')
			.then((res) => {
				setStates(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	const columns = [
		{ name: 'state', header: 'State', defaultFlex: 1 },
		{ name: 'code', header: 'Code', defaultFlex: 1 },
		{ name: 'nickname', header: 'Nickname', defaultFlex: 2 },
		{ name: 'website', header: 'Website', defaultFlex: 2},
		{ name: 'admission_date', header: 'Admission Date', defaultFlex: 2 },
		{ name: 'admission_number', header: 'Admission #', defaultFlex: 1 },
		{ name: 'capital_city', header: 'Capital', defaultFlex: 1 },
		{ name: 'population', header: 'Population', defaultFlex: 2 },
		{ name: 'population_rank', header: 'Population Rank', defaultFlex: 2 },
	]

	const gridStyle = { minHeight: 550, minWidth: 1400 }

	return (
		<div className=' w-full bg-gray-900 flex flex-wrap items-center justify-evenly'>
			{/* containter */}
			<div className='max-sm:w-screen'>
				{/* header filter secion */}
        <div className='w-screen sticky top-0 left-0 bg-gray-700 text-white py-[10%] flex items-center justify-center text-center text-xl'>
          <div className="">
          <p>Search State</p>
					<input
						onChange={filterBySearch}
						className=' px-5 py-2 text-black rounded-full text-xl'
						type='search'
					/></div>
				</div>
				<div className='max-sm:overflow-scroll'>
					{/* Data */}
					<ReactDataGrid
						className=' '
						idProperty='code'
						columns={columns}
						dataSource={filteredList}
						style={gridStyle}
					/>
				</div>
			</div>
		</div>
	)
}

export default App
