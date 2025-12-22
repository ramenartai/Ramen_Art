import options from "../Elements/options.js"

function Options(){
    return (
        <>
        <div className="options">
            {options.map((option) => (
                <div>{option.title}</div>
            ))}
            {options.map((option) => (
                <div>{option.icon}</div>
            ))}
        </div>
        </>
    )
}

export default Options;