echo "Compile UOG EFinance Start"
git pull

echo "Update Changes"
git add .
echo "Git Added"
git commit -m "UOG EFinance updated"
echo "Git Commit"
git push
echo "Git Updated"

echo "ng build command start"
ng build --prod --base-href ./

echo "Remove old files of EFinance"
rm -r /e/cwiztechproject/cwiztechwebapps/uog/efinance/*

echo "Copy new files of UOG EFinance from efinance to cwiztechproject/cwiztechwebapps/uog/efinance"
cp -r efinance/* /e/cwiztechproject/cwiztechwebapps/uog/efinance

echo "Push work for Live Server"
cd /e/cwiztechproject/cwiztechwebapps/uog
git pull

echo "Directory Changed"
git add .
echo "Git Added"
git commit -m "UOG EFinance updated"
echo "Git Commit"
git push
echo "Git Updated"
