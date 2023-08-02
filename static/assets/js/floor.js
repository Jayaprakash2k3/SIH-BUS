function addFloor()
{
    const flr=`<div onclick="floorClicked()" class="floor row justify-content-around py-2" style="min-height:70px;">

    <div class="col-3" style="background-color: #87CED9;">
      &nbsp;
    </div>
    <div class="col-3" style="background-color: #87CED9;">
      &nbsp;
    </div>
    <div class="col-3" style="background-color: #87CED9;">
      &nbsp;
    </div>

  </div>`
    var floors = document.getElementById("floors")
    floors.innerHTML = flr + floors.innerHTML;
    
}

function floorClicked()
{
    document.getElementById('frontView').hidden = true;
    document.getElementById('topView').hidden =false;
}

function frontView()
{
    document.getElementById('frontView').hidden = false;
    document.getElementById('topView').hidden = true;
}

function addRoom()
{

    const rooms = document.getElementById("rooms");
    const room=`<div class="room col-3 font-bold text-center h3 text-white" style="background-color:brown;">
    ${rooms.getElementsByClassName("room").length+1}
  </div>`
    rooms.innerHTML = rooms.innerHTML+room 
}