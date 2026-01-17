class box1Template {
    constructor(mass, velocity) {
        this.mass = mass;
        this.velocity = velocity;
        this.element = document.createElement("div");
        this.element.classList.add("box");
        document.querySelector("body").appendChild(this.element);
        this.element.style.width = String(60+mass*8)+"px";
        this.element.style.height = String(60+mass*8)+"px";
        this.element.style.transform = "translate(-50%, -50%)";
        this.element.style.left = String(60+ (60+mass*8)/2)+"px";

        this.width = parseFloat(this.element.style.width);
    }
}

class box2Template {
    constructor(mass, velocity) {
        this.mass = mass;
        this.velocity = velocity;
        this.element = document.createElement("div");
        this.element.classList.add("box");
        document.querySelector("body").appendChild(this.element);
        this.element.style.width = String(60+mass*8)+"px";
        this.element.style.height = String(60+mass*8)+"px";
        this.element.style.transform = "translate(-50%, -50%)";


        this.element.style.left = (window.innerWidth - 60)-(60+mass*8)/2 + "px";

        this.width = parseFloat(this.element.style.width);
    }
}

function calculateNewVelocities(box1, box2) {
    console.log("BEFORE COLLISION: \n m1 = "+box1.mass+
        ",  v1 = " + box1.velocity/30 + "\n m2 = "+box2.mass+
        ",  v2 = " + box2.velocity/30
    );
    setTimeout(() => {
        debounce = true;
    }, 500);
    const m1 = box1.mass;
    const v1 = box1.velocity;
    const m2 = box2.mass;
    const v2 = box2.velocity;

    const v2Prime = (m1*v2 - 2*m1*v1 - m2*v2)/(-1*m2-m1);
    const v1Prime = v2 + v2Prime - v1;

    box1.velocity = v1Prime;
    box2.velocity = v2Prime;
    console.log("AFTER COLLISION: \n m1 = "+box1.mass+
        ",  v1 = " + box1.velocity/30 + "\n m2 = "+box2.mass+
        ",  v2 = " + box2.velocity/30
    );
}



let running = false;
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("collisionForm");
    const stopButton = document.getElementById("stopButton");

    form.addEventListener("submit", () => {
        event.preventDefault();
        if (running) {return}
        running = true;

        // box 1 properties
        const mass1 = document.getElementById("mass1").value;
        const speed1 = document.getElementById("velocity1").value;
        box1 = new box1Template(mass1, speed1*30);

        // box 2 properties
        const mass2 = document.getElementById("mass2").value;
        const speed2 = document.getElementById("velocity2").value;
        box2 = new box2Template(mass2, -speed2*30);

        // Simulation begins here
        stopButton.style.display = "block";

        let last = performance.now();
        let debounce = true;
        function loop(now) {
            if (running === false) {
                return;
            }

            if (debounce) {
                debounce = false;
                const dt = (now - last) / 1000;
                last = now;



                let rect1 = box1.element.getBoundingClientRect();
                let rect2 = box2.element.getBoundingClientRect();

                const box1Right = rect1.right;
                const box1Left = rect1.left;

                const box2Right = rect2.right;
                const box2Left = rect2.left;


                let collided = (window.innerWidth-box1Right-(window.innerWidth-box2Left)) <= 0;

                if (box1Left <= 60) {
                    box1.velocity = -(box1.velocity);
                    const overlap = 60-box1Left;
                    if (overlap > 0) {
                        box1.element.style.left = parseFloat(box1.element.style.left)+overlap+"px";
                    }
                }

                if ((window.innerWidth-box2Right) <= 60) {
                    box2.velocity = -(box2.velocity);
                    const overlap = 60-(window.innerWidth-box2Right);
                    if (overlap > 0) {
                        box2.element.style.left = parseFloat(box2.element.style.left)-overlap+"px";
                    }
                }

                if (collided) {
                    calculateNewVelocities(box1, box2);
                }

                let currentLeft = box1.element.style.left;
                let currentBox2Left = box2.element.style.left;
                box1.element.style.left = (parseFloat(currentLeft) + box1.velocity * dt) + "px";
                box2.element.style.left = (parseFloat(currentBox2Left) + box2.velocity * dt) + "px";
                
                debounce = true;
                requestAnimationFrame(loop);
            }
        }
        requestAnimationFrame(loop);
    });

    stopButton.addEventListener("click", () => {
        running = false;
        stopButton.style.display = "none";
        box1.element.remove();
        box2.element.remove();
        box1 = null;
        box2 = null;
    })

})
