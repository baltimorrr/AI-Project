

class Passenger {
    constructor(img, x, y, name, index = 0, pilot = false) {
        this.pos = {
            x: x,
            y: y
        }
        this.index = index
        let s = Math.max(w, h) * 0.07
        this.w = s
        this.h = s
        this.side = 0
        this.pilot = pilot
        this.name = name
        this.img = img
    }

    show() {
        this.pos.x = this.side * w4 + w4/4
		this.pos.y = this.index * this.h + (h-this.w*4)/2
		
		c.drawImage(this.img,this.pos.x,this.pos.y,this.w,this.h)
    }

    action() {
        if(boat.side == 0) {
            if(this.side == 0) {
                boat.addPassenger(this)
            }
            else if(this.side == 1) {
                this.side = 0
                boat.removePassenger(this)
            }
            console.log(this.side)
        }
        else {
            console.log(this.side)
            if(this.side == 2) boat.removePassenger(this)
            else boat.addPassenger(this)
        }
        //console.log(matrix)
    }
}