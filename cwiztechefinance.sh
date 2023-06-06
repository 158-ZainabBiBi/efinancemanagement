echo "Compile CWIZTECH EFinance Start"
git pull

echo "Update Changes"
git add .
echo "Git Added"
git commit -m "CWIZTECH EFinance updated"
echo "Git Commit"
git push
echo "Git Updated"

echo "ng build command start"
ng build --prod --base-href ./

echo "Remove old files of EFinance"
rm -r /c/cwiztechproject/cwiztechwebapps/efinance/*

echo "Copy new files of CWIZTECH EFinance from efinance to cwiztechproject/cwiztechwebapps/efinance"
cp -r efinance/* /c/cwiztechproject/cwiztechwebapps/efinance

echo "Push work for Live Server"
cd /c/cwiztechproject/cwiztechwebapps
git pull

echo "Directory Changed"
git add .
echo "Git Added"
git commit -m "CWIZTECH EFinance updated"
echo "Git Commit"
git push
echo "Git Updated"
