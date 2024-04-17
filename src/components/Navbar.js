import Dropdown from "./Dropdown"

function Navbar (props) {
    const { defaultValue, options, handleChange } = props
    return (
        <div className="navbar">Select Target: 
            <Dropdown defaultValue={defaultValue} options={options} handleChange={handleChange}/>
        </div>
    )
}

export default Navbar