sudo sed -i -- "s/xserver-command=X -nocursor/#xserver-command=X/" /etc/lightdm/lightdm.conf # Show mouse cursor
sudo reboot # Restart lightdm to apply changes