sudo sed -i -- "s/#xserver-command=X/xserver-command=X -nocursor/" /etc/lightdm/lightdm.conf # Hide mouse cursor
sudo reboot # Restart lightdm to apply changes