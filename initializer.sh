#!/bin/zsh

stack_name=$1
if [ -z "$stack_name" ]; then
  echo "stack_name is empty"
  exit 1
fi

# 配列を定義
declare -A array

# 配列に値をセット
array["UserPoolId"]=$(aws cloudformation describe-stacks --stack-name $stack_name --query "Stacks[0].Outputs[?OutputKey=='UserPoolId'].OutputValue" --output text --no-cli-pager)
array["UserPoolClientId"]=$(aws cloudformation describe-stacks --stack-name $stack_name --query "Stacks[0].Outputs[?OutputKey=='UserPoolClientId'].OutputValue" --output text --no-cli-pager)

# .envファイルを作成
echo "" >> .env
echo "# Generated automatically by initializer.sh" >> .env
echo "# stack_name: $stack_name" >> .env
echo "USER_POOL_ID=\"${array["UserPoolId"]}\"" >> .env
echo "USER_POOL_CLIENT_ID=\"${array["UserPoolClientId"]}\"" >> .env
echo "" >> .env
