import React from 'react'

function SaveForLaterButton({handleSaveForLater} : {handleSaveForLater: () => void}) {
  return (
    <button
          type="button"
          onClick={handleSaveForLater}
          className="w-full mt-2 py-2 text-xs italic text-[#484848] underline"
        >
          Save my system for later
        </button>
  )
}

export default SaveForLaterButton