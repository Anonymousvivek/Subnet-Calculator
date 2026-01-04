# Visual Subnet Calculator

A comprehensive web-based subnet calculator that provides real-time network calculations with visual representations.

## Features

- Calculate network information from IP address and CIDR notation
- Display network address, broadcast address, and usable IP ranges
- Binary representation of IP addresses and subnet masks
- Visual network/host portion visualization
- Real-time calculations with smooth animations
- Responsive design for desktop and mobile devices
- Dark theme interface

## Usage

1. Open `index.html` in your web browser
2. Enter an IP address with CIDR notation (e.g., 192.168.1.10/24)
3. Click "Calculate" or press Enter
4. View the calculated network information and visual representations

## Input Format

The calculator accepts IP addresses in CIDR notation:
- Format: `IP_ADDRESS/SUBNET_BITS`
- Example: `192.168.1.10/24`
- CIDR range: 0-32

## Calculated Information

The tool provides the following network details:

- **Network Address**: The network identifier
- **Broadcast Address**: The broadcast address for the network
- **First Usable IP**: First host address available
- **Last Usable IP**: Last host address available
- **Subnet Mask**: The subnet mask in dotted decimal notation
- **Total Hosts**: Total number of possible host addresses
- **Usable Hosts**: Number of usable host addresses (excludes network and broadcast)

## Technical Details

### Technologies Used

- **HTML**: Structure
- **CSS3**: Styling with Tailwind CSS framework
- **JavaScript (ES6+)**: Pure JavaScript, no external libraries
- **Responsive Design**: Mobile-first approach


## File Structure

```
project/
├── index.html          # Main HTML file
├── script.js           # JavaScript calculations and UI logic
├── style.css           # Custom CSS (minimal, mostly Tailwind)
└── README.md           # This file
```


## Development
The project uses:
- Tailwind CSS via CDN for styling
- Pure JavaScript (no build process required)
- No external dependencies or frameworks

## Features in Detail

### Binary Representation
- Shows IP address, subnet mask, and network address in binary format
- Color-coded octets for easy reading

### Visual Network Range
- Interactive bar chart showing network vs host portions
- Dynamic sizing based on CIDR notation
- Color-coded sections (blue for network, green for hosts)

### Error Handling
- Input validation for IP addresses and CIDR ranges
- User-friendly error messages
- Real-time feedback


---

For questions or support, please open an issue in the repository.
