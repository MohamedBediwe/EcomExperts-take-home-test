import db from './db'

db.exec('DELETE FROM variants; DELETE FROM products; DELETE FROM steps;')

const insertStep = db.prepare('INSERT INTO steps (id, title, icon, order_num) VALUES (?, ?, ?, ?)')
insertStep.run(1, 'Choose your cameras', `http://localhost:5000/icons/camera.svg`, 1)
insertStep.run(2, 'Choose your plan', `http://localhost:5000/icons/shield.svg`, 2)
insertStep.run(3, 'Choose your sensors', `http://localhost:5000/icons/sensor.svg`, 3)
insertStep.run(4, 'Add extra protection', `http://localhost:5000/icons/grid.svg`, 4)

const insertProduct = db.prepare(`
  INSERT INTO products (id, name, description, image, badge_text, badge_color, has_variants, price, compare_at_price, category, step_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

insertProduct.run('wyze-cam-v4', 'Wyze Cam v4', 'The clearest Wyze Cam ever made.', `http://localhost:5000/images/wyze-cam-v4.png`, 'Save 22%', '#6B4CFF', 1, 27.98, 35.98, 'cameras', 1)
insertProduct.run('wyze-cam-pan-v3', 'Wyze Cam Pan v3', '360° pan and 180° tilt security camera.', `http://localhost:5000/images/wyze-cam-pan-v3.png`, 'Save 12%', '#6B4CFF', 1, 34.98, 39.98, 'cameras', 1)
insertProduct.run('wyze-cam-floodlight-v2', 'Wyze Cam Floodlight v2', '2K floodlight camera with a 160° wide-angle view for your garage.', `http://localhost:5000/images/wyze-cam-floodlight-v2.png`, 'Save 22%', '#6B4CFF', 1, 69.98, 89.98, 'cameras', 1)
insertProduct.run('wyze-duo-cam-doorbell', 'Wyze Duo Cam Doorbell', 'Two cameras. Two views. Double the porch protection.', `http://localhost:5000/images/wyze-duo-cam-doorbell.png`, null, null, 0, 69.98, null, 'cameras', 1)
insertProduct.run('wyze-battery-cam-pro', 'Wyze Battery Cam Pro', 'Protect anywhere. See everything in 2.5K HDR. No power outlet or electrician needed.', `http://localhost:5000/images/wyze-battery-cam-pro.png`, null, null, 1, 89.98, null, 'cameras', 1)
insertProduct.run('cam-unlimited', 'Cam Unlimited', 'Unlimited cloud recording for all your cameras.', 'http://localhost:5000/images/cam-plan.png', null, null, 0, 9.99, 12.99, 'plan', 2)
insertProduct.run('motion-sensor', 'Wyze Sense Motion Sensor', 'Detect motion and trigger automations.', `http://localhost:5000/images/motion-sensor.png`, null, null, 0, 29.99, null, 'sensors', 3)
insertProduct.run('sense-hub', 'Wyze Sense Hub (Required)', 'Central hub for all your Wyze sensors.', `http://localhost:5000/images/sense-hub.png`, null, null, 0, 0, 29.99, 'sensors', 3)
insertProduct.run('microsd-256gb', 'Wyze MicroSD Card (256GB)', 'Local storage for continuous recording.', `http://localhost:5000/images/microsd-256gb.png`, null, null, 0, 20.98, null, 'accessories', 4)

const insertVariant = db.prepare('INSERT INTO variants (id, product_id, label, swatch, price) VALUES (?, ?, ?, ?, ?)')

insertVariant.run('white', 'wyze-cam-v4', 'White', `http://localhost:5000/images/wyze-cam-v4-white.png`, 27.98)
insertVariant.run('grey', 'wyze-cam-v4', 'Grey', `http://localhost:5000/images/wyze-cam-v4-grey.png`, 27.98)
insertVariant.run('black', 'wyze-cam-v4', 'Black', `http://localhost:5000/images/wyze-cam-v4-black.png`, 27.98)

insertVariant.run('white', 'wyze-cam-pan-v3', 'White', `http://localhost:5000/images/wyze-cam-pan-v3-white.png`, 34.98)
insertVariant.run('black', 'wyze-cam-pan-v3', 'Black', `http://localhost:5000/images/wyze-cam-pan-v3-black.png`, 34.98)

insertVariant.run('white', 'wyze-cam-floodlight-v2', 'White', `http://localhost:5000/images/wyze-cam-floodlight-v2-white.png`, 69.98)
insertVariant.run('black', 'wyze-cam-floodlight-v2', 'Black', `http://localhost:5000/images/wyze-cam-floodlight-v2-black.png`, 69.98)

insertVariant.run('white', 'wyze-battery-cam-pro', 'White', `http://localhost:5000/images/wyze-battery-cam-pro-white.png`, 89.98)
insertVariant.run('black', 'wyze-battery-cam-pro', 'Black', `http://localhost:5000/images/wyze-battery-cam-pro-black.png`, 89.98)

console.log('Seeded successfully')